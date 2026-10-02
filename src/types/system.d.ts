interface SystemInfo {
  os: string;
  arch: string;
  hostname: string;
  used_mem: number;
  total_mem: number;
  cpu_len: number;
  kernel: string
  disks: DiskInfo[]
}

interface DiskInfo {
    name: string,
    mount_point: string,
    total_space: number,
    available_space: number,
}

interface ListContainerInfo {
  id: string,
  name: string,
  image: string,
  state: string,
  status: string,
}