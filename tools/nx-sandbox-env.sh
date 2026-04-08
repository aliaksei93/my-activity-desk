# Local Nx helper to work around socket restrictions in the sandbox.
# Source this file in your shell: `source ./tools/nx-sandbox-env.sh`
export NX_ISOLATE_PLUGINS=false
export NX_DAEMON=false
alias nx='NX_ISOLATE_PLUGINS=false NX_DAEMON=false npx nx'
