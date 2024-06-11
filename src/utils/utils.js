import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

export const formatDate = (dateFormat, date = new Date()) => {
  let inputDate = new Date(date)
  if (dateFormat === 'mm/yy') {
    // format mm/yy
    return inputDate.toLocaleDateString(undefined, {
      month: '2-digit',
      year: '2-digit'
    })
  } else if (dateFormat === 'long-noDay') {
    return inputDate.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric'
    })
  } else {
    return inputDate.toLocaleDateString()
  }
}

export const compareMonth = (dateOne, dateTwo) => {
  return !!formatDate('mm/yy', dateOne) == formatDate('mm/yy', dateTwo)
}

export function copyToClipClipboard(value) {
  navigator.clipboard.writeText(value).then(() => {
    toast({ title: 'Copiado! ✅' })
  })
}
