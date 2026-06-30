import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ExportButtonProps {
  onExportPDF?: () => void
  onExportExcel?: () => void
}

export function ExportButton({ onExportPDF, onExportExcel }: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="md" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onExportPDF && (
          <DropdownMenuItem onClick={onExportPDF}>
            Export as PDF
          </DropdownMenuItem>
        )}
        {onExportExcel && (
          <DropdownMenuItem onClick={onExportExcel}>
            Export as Excel
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
