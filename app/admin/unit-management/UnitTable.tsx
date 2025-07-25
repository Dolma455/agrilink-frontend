import { Button } from "@/components/ui/button"
import { Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { Tooltip,TooltipContent,TooltipTrigger,} from "@/components/ui/tooltip"
import { Edit, Trash2 } from "lucide-react"
import { UnitProps } from "../user-management/type"

interface UnitsTableProps {
  units: UnitProps[];
  isLoading: boolean;
  handleEdit: (unit: UnitProps) => void;
  handleDelete: (id: string) => void;
}

export default function UnitsTable({ units, isLoading, handleEdit, handleDelete }: UnitsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Units ({units.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No units found.
                  </TableCell>
                </TableRow>
              )}
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.symbol}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(unit)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(unit.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
