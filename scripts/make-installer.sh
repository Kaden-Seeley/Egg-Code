#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
dist_dir="$project_dir/dist"
appimage="$(find "$dist_dir" -maxdepth 1 -type f -name 'EggCode-*.AppImage' -print -quit)"

if [[ -z "$appimage" ]]; then
    printf 'No EggCode AppImage found in %s. Build it first.\n' "$dist_dir" >&2
    exit 1
fi

work_dir="$(mktemp -d)"
trap 'rm -rf -- "$work_dir"' EXIT

cp -- "$appimage" "$work_dir/EggCode.AppImage"
cp -- "$project_dir/assets/Egg_In_Pan.png" "$work_dir/EggCode.png"
tar -czf "$work_dir/payload.tar.gz" -C "$work_dir" EggCode.AppImage EggCode.png

appimage_name="${appimage##*/EggCode-}"
version_arch="${appimage_name%.AppImage}"
version="${version_arch%%-*}"
architecture="${version_arch#*-}"
installer="$dist_dir/EggCode-Linux-${architecture}-Installer-${version}.run"
header="$work_dir/installer-header"

cat > "$header" <<'INSTALLER_HEADER'
#!/usr/bin/env bash
set -Eeuo pipefail
PAYLOAD_OFFSET=000000000000

show_error() {
    if command -v zenity >/dev/null 2>&1; then
        zenity --error --title='EggCode Installer' --text="$1" 2>/dev/null || true
    else
        printf '%s\n' "$1" >&2
    fi
}

usage() {
    printf 'Usage: %s [--install-dir DIRECTORY]\n' "$0"
}

install_dir=''
while (($#)); do
    case "$1" in
        --install-dir)
            if (($# < 2)); then
                usage >&2
                exit 2
            fi
            install_dir=$2
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            usage >&2
            exit 2
            ;;
    esac
done

if [[ -z "$install_dir" ]]; then
    default_install_dir="$HOME/Applications"
    mkdir -p -- "$default_install_dir"
    if command -v zenity >/dev/null 2>&1; then
        install_dir="$(zenity --file-selection --directory --title='Choose where to install EggCode' --filename="$default_install_dir/")" || exit 0
    elif command -v kdialog >/dev/null 2>&1; then
        install_dir="$(kdialog --getexistingdirectory "$default_install_dir" 'Choose where to install EggCode')" || exit 0
    elif [[ -t 0 ]]; then
        printf 'Install folder [%s/EggCode]: ' "$default_install_dir"
        IFS= read -r install_dir || exit 1
        install_dir=${install_dir:-"$default_install_dir/EggCode"}
    else
        show_error 'A folder chooser is not available. Run this installer from a terminal and provide --install-dir DIRECTORY.'
        exit 1
    fi
fi

if [[ -z "$install_dir" ]] || ! mkdir -p -- "$install_dir"; then
    show_error 'The selected install folder could not be created.'
    exit 1
fi
install_dir="$(cd -- "$install_dir" && pwd -P)"

payload_start=$((10#$PAYLOAD_OFFSET + 1))
if ! tail -c "+$payload_start" "$0" | tar -xz -C "$install_dir" --no-same-owner; then
    show_error 'EggCode could not be unpacked into the selected folder.'
    exit 1
fi

app_path="$install_dir/EggCode.AppImage"
icon_path="$install_dir/EggCode.png"
chmod +x "$app_path"

applications_dir="$HOME/.local/share/applications"
mkdir -p -- "$applications_dir"
desktop_file="$applications_dir/eggcode.desktop"
exec_path=${app_path//\\/\\\\}
exec_path=${exec_path//\"/\\\"}
exec_path=${exec_path//\$/\\\$}
exec_path=${exec_path//\`/\\\`}
exec_path=${exec_path//%/%%}
icon_value=${icon_path//\\/\\\\}
icon_value=${icon_value// /\\s}

{
    printf '%s\n' '[Desktop Entry]' 'Type=Application' 'Name=EggCode'
    printf 'Exec="%s"\n' "$exec_path"
    printf 'Icon=%s\n' "$icon_value"
    printf '%s\n' 'Terminal=false' 'Categories=Utility;'
} > "$desktop_file"

if command -v zenity >/dev/null 2>&1; then
    zenity --info --title='EggCode Installed' --text="EggCode is installed in:\n$install_dir" 2>/dev/null || true
else
    printf 'EggCode installed in: %s\nApplication menu entry: %s\n' "$install_dir" "$desktop_file"
fi
exit 0
INSTALLER_HEADER

offset="$(wc -c < "$header")"
printf -v padded_offset '%012d' "$offset"
sed -i "s/^PAYLOAD_OFFSET=.*/PAYLOAD_OFFSET=$padded_offset/" "$header"
cat "$header" "$work_dir/payload.tar.gz" > "$installer"
chmod +x "$installer"

printf 'Created installer: %s\n' "$installer"