use crate::types::{ContainerInfo, DiskInfo, SystemInfo};
use bollard::{Docker, query_parameters::ListContainersOptions};
use sysinfo::{System, Disks};

#[tauri::command]
pub fn get_sys_info() -> SystemInfo {
    let mut sys = System::new_all();

    std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
    sys.refresh_cpu_all();
    sys.refresh_memory();

    let disks = Disks::new_with_refreshed_list();

    let disks_info = disks.iter().map(|disk| DiskInfo {
        name: disk.name().to_string_lossy().into_owned(),
        mount_point: disk.mount_point().to_string_lossy().into_owned(),
        total_space: disk.total_space(),
        available_space: disk.available_space(),
    }).collect();

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
        disks: disks_info,
    }
}

#[tauri::command]
pub async fn list_containers() -> Result<Vec<ContainerInfo>, String> {
    let docker = Docker::connect_with_named_pipe_defaults()
        .map_err(|e| format!("Failed to connect to Docker: {e}"))?;

    let options = ListContainersOptions {
        all: true,
        ..Default::default()
    };

    let containers = docker
        .list_containers(Some(options))
        .await
        .map_err(|e| format!("Failed to list containers: {e}"))?;

    let result = containers
        .into_iter()
        .map(|container| {
            let name = container
                .names
                .unwrap_or_default()
                .first()
                .cloned()
                .unwrap_or_default()
                .trim_start_matches('/')
                .to_string();

            ContainerInfo {
                id: container.id.unwrap_or_default(),
                name,
                image: container.image.unwrap_or_default(),
                state: container.state.map(|state| state.to_string()).unwrap_or_else(|| "unknown".to_string()),
                status: container.status.unwrap_or_default(),
            }
        })
        .collect();

    Ok(result)
}