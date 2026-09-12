use crate::types::SystemInfo;

#[tauri::command]
pub fn get_sys_info() -> SystemInfo {
    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        hostname: hostname::get()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned(),
    }
}