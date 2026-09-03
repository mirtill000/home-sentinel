#!/usr/bin/env python3
"""Home Sentinel: report periodico via email (nuovi device, alert, traffico WiFi).

Non fa parte del processo daemon continuo: pensato per essere lanciato
periodicamente da un timer systemd (vedi systemd/home-sentinel-report.*)
o da cron. Legge lo specchio SQLite del daemon (--db, stesso path passato
a home_sentinel.py) — non i JSONL, che possono essere già stati ruotati o
parzialmente scaricati dalla dashboard: SQLite resta la fonte di verità
per la storia completa, salvo che tu abbia disabilitato --no-db.

Uso minimo:
    python3 send_report.py \
        --smtp-host smtp.example.com --smtp-port 587 --use-tls \
        --smtp-user me@example.com --from-addr home-sentinel@example.com \
        --to-addr me@example.com

La password SMTP non va mai passata in chiaro sulla riga di comando: si
legge da una variabile d'ambiente (--smtp-password-env, default
HOME_SENTINEL_SMTP_PASSWORD). Con --dry-run il report viene stampato su
stdout invece che inviato, utile per testare la query senza configurare
un server SMTP.
"""

from __future__ import annotations

import argparse
import os
import smtplib
import sqlite3
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from pathlib import Path


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Home Sentinel - report periodico via email")
    p.add_argument("--db", default="/var/log/home-sentinel/home-sentinel.db", help="Database SQLite del daemon")
    p.add_argument("--period-days", type=int, default=7, help="Periodo del digest, in giorni")

    p.add_argument("--smtp-host", required=True)
    p.add_argument("--smtp-port", type=int, default=587)
    p.add_argument("--smtp-user", default=None, help="Omettilo se il server SMTP non richiede autenticazione")
    p.add_argument(
        "--smtp-password-env",
        default="HOME_SENTINEL_SMTP_PASSWORD",
        help="Nome della variabile d'ambiente con la password SMTP (mai passarla in chiaro da CLI)",
    )
    p.add_argument("--use-tls", action="store_true", help="STARTTLS su connessione in chiaro (porta tipica 587)")
    p.add_argument("--use-ssl", action="store_true", help="SMTPS diretto (porta tipica 465)")

    p.add_argument("--from-addr", required=True)
    p.add_argument("--to-addr", required=True, help="Uno o più destinatari separati da virgola")
    p.add_argument("--subject-prefix", default="[Home Sentinel]")

    p.add_argument("--dry-run", action="store_true", help="Stampa il report su stdout invece di inviarlo via email")
    return p.parse_args()


def build_report(db_path: Path, period_days: int) -> tuple[str, dict]:
    conn = sqlite3.connect(str(db_path))
    since = (datetime.now(timezone.utc) - timedelta(days=period_days)).isoformat()

    new_devices = conn.execute(
        "SELECT COUNT(DISTINCT mac) FROM lan_events WHERE status='new' AND timestamp >= ?", (since,)
    ).fetchone()[0]
    total_devices = conn.execute("SELECT COUNT(DISTINCT mac) FROM lan_events").fetchone()[0]

    alerts_by_type = conn.execute(
        "SELECT type, severity, COUNT(*) FROM alerts WHERE timestamp >= ? "
        "GROUP BY type, severity ORDER BY COUNT(*) DESC",
        (since,),
    ).fetchall()
    total_alerts = sum(row[2] for row in alerts_by_type)

    top_traffic: list[tuple[str, float]] = []
    try:
        top_traffic = conn.execute(
            "SELECT mac, SUM(bytes) AS total_bytes FROM wifi_traffic WHERE timestamp >= ? "
            "GROUP BY mac ORDER BY total_bytes DESC LIMIT 10",
            (since,),
        ).fetchall()
    except sqlite3.OperationalError:
        pass  # tabella assente: daemon con --no-wifi-traffic o versione precedente a questa feature

    conn.close()

    lines = [
        f"Home Sentinel — report ultimi {period_days} giorni",
        "=" * 40,
        "",
        f"Dispositivi nuovi nel periodo: {new_devices}",
        f"Dispositivi totali mai visti: {total_devices}",
        f"Alert generati nel periodo: {total_alerts}",
    ]
    if alerts_by_type:
        lines.append("")
        lines.append("Alert per tipo/severità:")
        for type_, severity, count in alerts_by_type:
            lines.append(f"  - {type_} ({severity}): {count}")
    if top_traffic:
        lines.append("")
        lines.append(
            "Top 10 device per traffico WiFi stimato (frame dati catturati durante il "
            "channel hopping — indicatore relativo, non banda esatta):"
        )
        for mac, total_bytes in top_traffic:
            lines.append(f"  - {mac}: {total_bytes / 1024:.1f} KB")

    lines.append("")
    lines.append("-- Home Sentinel")

    body = "\n".join(lines)
    stats = {"new_devices": new_devices, "total_devices": total_devices, "total_alerts": total_alerts}
    return body, stats


def send_email(args: argparse.Namespace, body: str, stats: dict) -> None:
    msg = EmailMessage()
    msg["Subject"] = (
        f"{args.subject_prefix} Report — {stats['new_devices']} nuovi device, "
        f"{stats['total_alerts']} alert ({args.period_days}g)"
    )
    msg["From"] = args.from_addr
    msg["To"] = args.to_addr
    msg.set_content(body)

    password = os.environ.get(args.smtp_password_env, "") if args.smtp_user else ""

    if args.use_ssl:
        with smtplib.SMTP_SSL(args.smtp_host, args.smtp_port) as server:
            if args.smtp_user:
                server.login(args.smtp_user, password)
            server.send_message(msg)
    else:
        with smtplib.SMTP(args.smtp_host, args.smtp_port) as server:
            if args.use_tls:
                server.starttls()
            if args.smtp_user:
                server.login(args.smtp_user, password)
            server.send_message(msg)


def main() -> None:
    args = parse_args()
    db_path = Path(args.db)
    if not db_path.exists():
        raise SystemExit(
            f"Database SQLite non trovato: {db_path}. Il daemon lo crea al primo avvio "
            "(a meno che non giri con --no-db)."
        )

    body, stats = build_report(db_path, args.period_days)

    if args.dry_run:
        print(body)
        return

    send_email(args, body, stats)
    print(f"Report inviato a {args.to_addr}")


if __name__ == "__main__":
    main()
