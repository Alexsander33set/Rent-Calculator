<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { useColorMode } from "@vueuse/core";
const mode = useColorMode();

import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
console.log(props.modelValue);
function changeViewHistory() {
  emit("update:modelValue", !props.modelValue);
}
</script>

<template>
  <div class="border-b flex justify-between items-center h-16 px-4">
    <h1
      class="inline-flex items-center whitespace-nowrap font-medium h-9 px-5 py-2 justify-between"
    >
      Rent Calculator
    </h1>
    <nav class="flex items-center space-x-4">
      <Button @click="changeViewHistory">{{
        modelValue ? "New Request" : "History"
      }}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            <span class="sr-only">Toggle theme</span>
            <Icon
              icon="radix-icons:moon"
              class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Icon
              icon="radix-icons:sun"
              class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="mode = 'light'"> Light </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'dark'"> Dark </DropdownMenuItem>
          <DropdownMenuItem @click="mode = 'auto'"> System </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  </div>
</template>
