import {
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Badge } from '@/components/ui/badge'

interface ListContainerInfo {
  id: string
  name: string
  image: string
  state: string
  status: string
}

interface DockerTableProps {
  containers: ListContainerInfo[]
}

const features = tableFeatures({ columnVisibilityFeature })

const columnHelper = createColumnHelper<typeof features, ListContainerInfo>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),

  columnHelper.accessor('image', {
    header: 'Image',
  }),

  columnHelper.accessor('state', {
    header: 'State',
    cell: (info) => {
      const state = info.getValue()

      return (
        <Badge variant={state === 'running' ? 'default' : 'secondary'}>
          {state}
        </Badge>
      )
    },
  }),

  columnHelper.accessor('status', {
    header: 'Status',
  }),

  columnHelper.accessor('id', {
    header: 'Container ID',
    cell: (info) => (
      <code className="text-xs text-muted-foreground">
        {info.getValue().slice(0, 12)}
      </code>
    ),
  }),
])

export function DockerTable({ containers }: DockerTableProps) {
  const table = useTable({
    features,
    columns,
    data: containers,
  })

  const rows = table.getRowModel().rows

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No containers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}