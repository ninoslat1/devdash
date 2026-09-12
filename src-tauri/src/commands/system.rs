use crate::types::SystemInfo;
use sysinfo::{System};

#[tauri::command]
pub fn get_sys_info() -> SystemInfo {
    let mut sys = System::new_all();

    std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu_all();
    sys.refresh_memory();

    let total_mem = sys.total_memory();
    let used_mem = sys.used_memory();
    let cpu_len = sys.cpus().len();
    let kernel = System::kernel_version();

    SystemInfo {
        os: std::env::consts::OS.to_string(),
        arch: std::env::consts::ARCH.to_string(),
        hostname: hostname::get()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned(),
        used_mem: used_mem,
        total_mem: total_mem,
        cpu_len: cpu_len,
        kernel: kernel,
    }
}