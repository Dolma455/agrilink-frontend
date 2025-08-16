import { ProductProps } from "../../type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface ProductTableProps {
  products: ProductProps[]
  isLoading: boolean
  onEdit: (product: ProductProps) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function ProductTable({ products, isLoading, onEdit, currentPage, totalPages, onPageChange }: ProductTableProps) {
  if (isLoading) return <p>Loading products...</p>

  if (!products.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products (0)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No products found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{product.unitName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}