import { Button } from "@/components/ui/button"
import { Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card"
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { Tooltip,TooltipContent,TooltipTrigger,} from "@/components/ui/tooltip"
import { Edit, Trash2 } from "lucide-react"
import { UserProps } from "../../type"

interface UserTableProps {
  users: UserProps[];
  activeTab: "Farmer" | "Vendor";
  isLoading: boolean;
  handleEdit: (user: UserProps) => void;
  handleDelete: (id: string) => void;
}

export default function UserTable({ users, activeTab, isLoading, handleEdit, handleDelete }: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {activeTab}s ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No {activeTab.toLowerCase()}s found.
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.businessName}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
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
                            onClick={() => handleDelete(user.id)}
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
