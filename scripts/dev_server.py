#!/usr/bin/env python3
"""Dependency-free editable development server for Nova Beach Ventures."""

import argparse
import errno
import os
from pathlib import Path
import socket
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse
import webbrowser


PROJECT_ROOT = Path(__file__).resolve().parent.parent
STATIC_ROOT = (PROJECT_ROOT / "dist").resolve()
RELOAD_CLIENT = """<script data-nova-dev-reload>
(()=>{let previous=null;setInterval(async()=>{try{const current=await fetch('/__dev_stamp',{cache:'no-store'}).then(response=>response.text());if(previous&&current!==previous)location.reload();previous=current;}catch{}},650);})();
</script>"""


def source_stamp():
    latest = 0
    for path in STATIC_ROOT.rglob("*"):
        if path.is_file() and not path.name.startswith("."):
            latest = max(latest, path.stat().st_mtime_ns)
    return str(latest)


class DevelopmentHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_ROOT), **kwargs)

    def log_message(self, format_string, *args):
        if self.path != "/__dev_stamp":
            super().log_message(format_string, *args)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/__dev_stamp":
            payload = source_stamp().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        if path == "/" or path.endswith(".html"):
            requested = "index.html" if path == "/" else unquote(path.lstrip("/"))
            candidate = (STATIC_ROOT / requested).resolve()
            if os.path.commonpath((str(STATIC_ROOT), str(candidate))) != str(STATIC_ROOT) or not candidate.is_file():
                self.send_error(404, "Not found")
                return
            html = candidate.read_text(encoding="utf-8")
            body = (html.replace("</body>", f"{RELOAD_CLIENT}</body>") if "</body>" in html else html + RELOAD_CLIENT).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()


def create_server(host, requested_port):
    if requested_port == 0:
        return ThreadingHTTPServer((host, 0), DevelopmentHandler)
    for port in range(requested_port, requested_port + 21):
        try:
            return ThreadingHTTPServer((host, port), DevelopmentHandler)
        except OSError as error:
            if error.errno != errno.EADDRINUSE:
                raise
    raise RuntimeError("No available development port between %d and %d." % (requested_port, requested_port + 20))


def network_address():
    try:
        address = socket.gethostbyname(socket.gethostname())
        return None if address.startswith("127.") else address
    except OSError:
        return None


def main():
    parser = argparse.ArgumentParser(description="Run Nova Beach Ventures from an editable local URL.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "4173")))
    parser.add_argument("--open", action="store_true", dest="open_browser")
    parser.add_argument("--no-open", action="store_false", dest="open_browser")
    parser.set_defaults(open_browser=False)
    options = parser.parse_args()
    server = create_server(options.host, options.port)
    port = server.server_address[1]
    local_url = f"http://localhost:{port}"
    print("\nNova Beach Ventures development server", flush=True)
    print(f"Local:   {local_url}", flush=True)
    print(f"Project: http://nova-beach-ventures.localhost:{port}", flush=True)
    if options.host == "0.0.0.0":
        address = network_address()
        if address:
            print(f"Network: http://{address}:{port}", flush=True)
    print("\nEditing files in dist/ reloads the browser automatically.", flush=True)
    print("Press Ctrl+C to stop.\n", flush=True)
    if options.open_browser:
        webbrowser.open(local_url)
    try:
        server.serve_forever(poll_interval=0.25)
    except KeyboardInterrupt:
        print("\nDevelopment server stopped.", flush=True)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
