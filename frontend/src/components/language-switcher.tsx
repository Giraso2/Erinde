import { useLanguageStore } from '@/store/language-store'
import { Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const languages = [
  { code: 'en' as const, label: 'EN', full: 'English' },
  { code: 'rw' as const, label: 'RW', full: 'Kinyarwanda' },
  { code: 'fr' as const, label: 'FR', full: 'Français' },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1 rounded-xl px-2"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">
            {languages.find((l) => l.code === language)?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(v) => setLanguage(v as 'en' | 'rw' | 'fr')}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem key={lang.code} value={lang.code}>
              {lang.full}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
