import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Package, AlertTriangle, Clock, Truck, Plus, X, Save,
  Pill, Syringe, Wrench,
} from 'lucide-react'
import { useAdminData } from '@/hooks/use-mock-data'
import type { InventoryItem } from '@/types'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ExportButton } from '@/components/export-button'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'

type CategoryTab = 'All' | 'Medicine' | 'Equipment' | 'Supplies'

const categoryTabs: CategoryTab[] = ['All', 'Medicine', 'Equipment', 'Supplies']

const categoryMap: Record<CategoryTab, InventoryItem['category'] | null> = {
  All: null,
  Medicine: 'medicine',
  Equipment: 'equipment',
  Supplies: 'supplies',
}

const categoryIcon: Record<InventoryItem['category'], typeof Pill> = {
  medicine: Pill,
  equipment: Wrench,
  supplies: Syringe,
}

function getItemStatus(item: InventoryItem): { variant: 'success' | 'warning' | 'error'; label: string } {
  if (item.expiryDate && new Date(item.expiryDate) < new Date()) {
    return { variant: 'error', label: 'Expired' }
  }
  if (item.quantity <= item.threshold * 0.3) {
    return { variant: 'error', label: 'Critically Low' }
  }
  if (item.quantity < item.threshold) {
    return { variant: 'warning', label: 'Low Stock' }
  }
  if (item.quantity < item.threshold * 2) {
    return { variant: 'warning', label: 'Below Recommended' }
  }
  return { variant: 'success', label: 'In Stock' }
}

function getQuantityColorClass(item: InventoryItem): string {
  if (item.expiryDate && new Date(item.expiryDate) < new Date()) return 'text-error'
  if (item.quantity <= item.threshold * 0.3) return 'text-error'
  if (item.quantity < item.threshold) return 'text-warning'
  return 'text-success'
}

const suppliers = [
  { name: 'Rwandapharma', items: 4, contact: '+250 788 100 200' },
  { name: 'MediRwanda', items: 2, contact: '+250 788 300 400' },
  { name: 'MedEquip Ltd', items: 2, contact: '+250 788 500 600' },
  { name: 'Surgical Supplies Co', items: 2, contact: '+250 788 700 800' },
  { name: 'Global Pharma', items: 1, contact: '+250 788 900 000' },
]

const newItemDefaults = { name: '', category: 'medicine' as InventoryItem['category'], quantity: 0, unit: '', threshold: 0, supplier: '' }

export default function Inventory() {
  const { inventory: initialInventory } = useAdminData()
  const [inventory, setInventory] = useState(initialInventory)
  const [activeTab, setActiveTab] = useState<CategoryTab>('All')
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState(newItemDefaults)

  const filtered = useMemo(() => {
    const cat = categoryMap[activeTab]
    return cat ? inventory.filter((i) => i.category === cat) : inventory
  }, [inventory, activeTab])

  const lowStockItems = inventory.filter((i) => i.quantity < i.threshold)
  const expiringSoon = inventory.filter(
    (i) => i.expiryDate && new Date(i.expiryDate) > new Date() && new Date(i.expiryDate) < new Date(Date.now() + 90 * 86400000),
  )
  const totalItems = inventory.reduce((s, i) => s + i.quantity, 0)

  const addItem = () => {
    if (!newItem.name || !newItem.unit) return
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity,
      unit: newItem.unit,
      threshold: newItem.threshold,
      supplier: newItem.supplier || undefined,
    }
    setInventory((prev) => [...prev, item])
    setNewItem(newItemDefaults)
    setDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="card" count={4} />
        <LoadingSkeleton type="table" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted">Track medicines, equipment, and hospital supplies</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButton onExportPDF={() => {}} onExportExcel={() => {}} />
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </motion.div>

      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 px-5 py-3"
        >
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <span className="text-sm font-medium text-foreground">
            {lowStockItems.length} item(s) below threshold
          </span>
          <span className="text-xs text-muted">
            {lowStockItems.map((i) => i.name).join(', ')}
          </span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard title="Total Items" value={totalItems} icon={Package} variant="default" />
        <StatCard title="Low Stock Items" value={lowStockItems.length} icon={AlertTriangle} variant="warning" />
        <StatCard title="Expiring Soon" value={expiringSoon.length} icon={Clock} variant="error" />
        <StatCard title="Suppliers" value={suppliers.length} icon={Truck} variant="default" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              {categoryTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-muted">Item</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Quantity</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Unit</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Threshold</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Expiry</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted">Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const status = getItemStatus(item)
                    const CatIcon = categoryIcon[item.category]
                    return (
                      <tr key={item.id} className="border-b border-border transition-colors hover:bg-secondary/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <CatIcon className="h-4 w-4 text-muted" />
                            <span className="font-medium text-foreground">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-muted">{item.category}</td>
                        <td className={`px-4 py-3 font-medium ${getQuantityColorClass(item)}`}>
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-muted">{item.unit}</td>
                        <td className="px-4 py-3 text-muted">{item.threshold.toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted">{item.expiryDate ?? 'N/A'}</td>
                        <td className="px-4 py-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted">{item.supplier ?? '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted">No inventory items in this category.</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Truck className="h-4 w-4 text-secondary" />
              Supplier Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {suppliers.map((supplier) => (
                <div key={supplier.name} className="rounded-2xl border border-border p-4 transition-all hover:shadow-md">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                    <Truck className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="font-medium text-foreground">{supplier.name}</p>
                  <p className="text-xs text-muted">{supplier.items} item(s)</p>
                  <p className="mt-1 text-xs text-muted">{supplier.contact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Item Name</label>
              <Input placeholder="e.g. Paracetamol 500mg" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Category</label>
              <div className="flex gap-2">
                {(['medicine', 'equipment', 'supplies'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewItem({ ...newItem, category: cat })}
                    className={`rounded-xl px-4 py-1.5 text-sm font-medium capitalize transition-all ${
                      newItem.category === cat
                        ? 'bg-secondary text-white shadow-sm'
                        : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Quantity</label>
                <Input type="number" min={0} value={newItem.quantity || ''} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Unit</label>
                <Input placeholder="e.g. tabs, boxes" value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Threshold</label>
                <Input type="number" min={0} value={newItem.threshold || ''} onChange={(e) => setNewItem({ ...newItem, threshold: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Supplier</label>
                <Input placeholder="Supplier name" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button variant="primary" onClick={addItem}>
              <Save className="h-4 w-4" />
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
