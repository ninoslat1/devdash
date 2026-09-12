use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct SystemInfo {
    pub os: String,
    pub arch: String,
    pub hostname: String,
    pub total_mem: u64,
    pub used_mem: u64,
    pub cpu_len: usize,
    pub kernel: Option<String>
}