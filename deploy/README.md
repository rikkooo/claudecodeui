# deploy/ — systemd + ngrok units for the Conectta dev instance

These files sit alongside the canonical `cloudcli.service` running the stock CloudCLI on port 3001. This fork runs in parallel on port 3002 and is exposed at `cloudcli-dev.conectta.co` (Google OAuth, single-email allowlist).

## Files

| file                          | purpose                                                  |
|-------------------------------|----------------------------------------------------------|
| `cloudcli-dev.service`        | systemd unit running `node dist-server/server/index.js`  |
| `ngrok-cloudcli-dev.service`  | ngrok tunnel → cloudcli-dev.conectta.co → 127.0.0.1:3002 |
| `cloudcli-dev-policy.yml`     | ngrok traffic policy (Google OAuth, single-email allow)  |

## Install (HQ only)

```
# Policy goes next to the prod one
sudo install -m 644 deploy/cloudcli-dev-policy.yml /home/admin/.config/ngrok/cloudcli-dev-policy.yml

# systemd units
sudo install -m 644 deploy/cloudcli-dev.service        /etc/systemd/system/cloudcli-dev.service
sudo install -m 644 deploy/ngrok-cloudcli-dev.service  /etc/systemd/system/ngrok-cloudcli-dev.service

sudo systemctl daemon-reload
sudo systemctl enable --now cloudcli-dev.service
sudo systemctl enable --now ngrok-cloudcli-dev.service
```

## Required env

`/home/admin/projects/claudecodeui/.env` (gitignored) must set:

```
SERVER_PORT=3002
HOST=127.0.0.1
DATABASE_PATH=/home/admin/.cloudcli-dev/auth.db
CONTEXT_WINDOW=160000
VITE_PORT=5174
VITE_CONTEXT_WINDOW=160000
FAL_KEY=<your fal.ai key>
```

`/home/admin/.env` must set `NGROK_AUTHTOKEN` (already the case on this box).

## Sanity

```
curl -sS -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3002/
curl -sS -o /dev/null -w "HTTP %{http_code}  redirect: %{redirect_url}\n" https://cloudcli-dev.conectta.co/
```

First should return `HTTP 200` (fork serves static + app). Second should return a `302` that redirects into Google's OAuth consent screen.

## Edit / reload

After editing any `.service` or policy file:

```
# Policy change only → tell ngrok to reload
sudo install -m 644 deploy/cloudcli-dev-policy.yml /home/admin/.config/ngrok/cloudcli-dev-policy.yml
sudo systemctl restart ngrok-cloudcli-dev

# systemd unit change → reinstall + daemon-reload + restart
sudo install -m 644 deploy/cloudcli-dev.service /etc/systemd/system/cloudcli-dev.service
sudo systemctl daemon-reload
sudo systemctl restart cloudcli-dev
```
