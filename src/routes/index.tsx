import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { ArrowDown, HardDrive } from "lucide-react";
import { formatBytes } from "@/libs/parser";
import { Progress } from "@/components/ui/progress";
import { Metric } from "@/components/Metric";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [container, setContainer] = useState<ListContainerInfo[] | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    invoke<SystemInfo>("get_sys_info").then(setInfo).catch(console.error);

    invoke<ListContainerInfo[]>("list_containers").then(setContainer).catch(console.error);
  }, []);

  if (!info && !container) {
    return <div>Loading...</div>;
  }

  const memoryProgress = (info!.used_mem / info!.total_mem) * 100;
  console.log(container);

  return (
    <div className="p-2">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Devdash!!</CardTitle>

          <CardDescription>Here's what's happening across your infrastructure.</CardDescription>

          <CardAction>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-md p-2 hover:bg-muted"
              aria-expanded={open}
              aria-label={open ? "Collapse system information" : "Expand system information"}
            >
              <ArrowDown
                className={`transition-transform duration-200 ${open ? "-rotate-180" : "rotate-0"}`}
              />
            </button>
          </CardAction>
        </CardHeader>

        {open && info && container && (
          <CardContent className="w-[95vw] mx-auto rounded-lg border border-green-500 bg-green-100/50 p-6">
            <div className="flex items-center justify-between">
              {/* Host */}
              <div>
                <div className="flex items-center gap-5">
                  <HardDrive className="text-green-900" />

                  <div>
                    <p className="font-bold text-green-900">{info.hostname}</p>

                    <p className="font-light text-green-900">
                      {info.os} {info.arch}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-5">
                <div>
                  <p className="font-bold text-green-900">Kernel Version</p>
                  <p className="font-light text-green-900">{info.kernel}</p>
                </div>

                

                <div>
                  <p className="font-bold text-green-900">Total CPUs</p>
                  <p className="font-light text-green-900">{info.cpu_len}</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {info && (
        <Card className="border border-none">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Current your hardware resource</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <Card>
              <CardContent>
                <Metric
                  label="Memory"
                  value={`${formatBytes(info.used_mem)} / ${formatBytes(info.total_mem)}`}
                  hint={`${memoryProgress.toFixed(1)}%`}
                  progress={Math.ceil(memoryProgress)}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
