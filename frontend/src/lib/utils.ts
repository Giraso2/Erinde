import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(date)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit',
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency', currency: 'RWF', minimumFractionDigits: 0,
  }).format(amount)
}
