interface SystemInfo {
  os: string;
  arch: string;
  hostname: string;
  used_mem: number;
  total_mem: number;
  cpu_len: number;
  kernel: string
};

interface ListContainerInfo {
  id: string,
  name: string,
  image: string,
  state: string,
  status: string,
}