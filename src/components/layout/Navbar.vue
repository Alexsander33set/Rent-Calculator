<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { Button } from '@/components/ui/button'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({

  modelValue: {
    type: Boolean,
    required: true
  }

})
console.log(props.modelValue)
function changeViewHistory() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="border-b flex justify-between items-center h-16 px-4">
    <h1 class="inline-flex items-center whitespace-nowrap font-medium h-9 px-5 py-2 justify-between">
      Rent Calculator</h1>
    <nav class="flex items-center space-x-4">
      <Button @click="changeViewHistory">History</Button>
    </nav>
  </div>
</template>