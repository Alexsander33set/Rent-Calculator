<script setup>
import { ref, computed } from "vue";

//* shadcn components
import { Icon } from "@iconify/vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-icons/vue";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast/use-toast";
import Toaster from "@/components/ui/toast/Toaster.vue";
const { toast } = useToast();

//* ||====================================||====================================||

import Navbar from "@/components/layout/Navbar.vue";
import { formatDate, compareMonth, copyToClipClipboard } from "@/utils/utils.js";

const history = ref(JSON.parse(localStorage.getItem("history")));
const viewHistory = ref(false);

const newRequest = ref({
  bills: {
    energy: 0,
    water: 0,
    distribution: [1, 1],
  },
  additionalCosts: [],
  isPaid: false,
  date: Date.now(),
  total: "",
});
let saveRequestLoading = ref(false);
let additionalCostsSize = ref(newRequest.value.additionalCosts.length);
const newRequestTotal = computed(() => {
  let { distribution, energy, water } = newRequest.value.bills;

  let expenses = 0;
  let rentedExpenses = distribution[1] / (distribution[0] + distribution[1]);

  try {
    expenses = Number(((energy + water) * rentedExpenses) + totalCosts()).toFixed(2);
  } catch (err) {
    console.error(err);
  }
  return expenses || 0;
});
const saveRequest = () => {
  saveRequestLoading.value = true;

  //* Validar campos, verificar se já existe, caso sim avisar e pedir certeza
  if (!history.value) {
    history.value = [];
    toast({
      title: "⚠️ Nenhum histórico encontrado!",
      description: "Estamos criando um novo para você...",
    });
  }

  history.value.forEach((request, index) => {
    if (compareMonth(newRequest.value.date, request.date)) {
      toast({
        title: "O aluguel deste mês já foi salvo!",
        description: "Delete o anterior ou clique novamente para sobrescreve-lo.",
      });
    } else {
      history.value.push(newRequest);
      toast({ title: "✅ Contas salvas com sucesso!" });
      saveRequestLoading.value = false;
    }
  });

  // getHistory.push(newRequest);
  // localStorage.setItem("history", JSON.stringify(getHistory));
};

let sideNav = ref([
  {
    tootip: "Exportar para WhatsApp",
    icon: "mdi:whatsapp",
    color: "",
    isOpen: false,
  },
]);

let costs = ref(newRequest.value.additionalCosts);
let costTemplate = {
  label: "",
  value: "",
  onEdit: true,
};
function addCost() {
  costs.value.push({ ...costTemplate });
}
function removeCost(index) {
  costs.value.splice(index, 1);
}
function alternateEditCost(index) {
  costs.value[index].onEdit = !costs.value[index].onEdit;
}
function totalCosts() {
  let totalCosts = 0;

  if (additionalCostsSize === 0) {
    return 0;
  }

  for (const cost of costs.value) {
    totalCosts += cost.value;
  }
  return Number(totalCosts);
}

let template = computed(() => {
  const separator = "────────────";

  const costsTemplate = () => {
    let costsTitle = "*Custos adicionais*\n";
    let inlineCosts = "";

    for (let cost of costs.value) {
      inlineCosts += `${cost.label}: ${Number(cost.value).toFixed(2)}\n`;
    }
    if (additionalCostsSize) {
      return costsTitle + inlineCosts + separator + "\n";
    } else {
      return "";
    }
  };

  const billsTemplate = () => {
    let { energy, water } = newRequest.value.bills;

    return `*Contas*
Luz      ${Number(energy).toFixed(2)}
Água   ${Number(water).toFixed(2)}
${separator}
*Total: ${newRequestTotal.value}*`;
  };

  return costsTemplate() + billsTemplate();
});

// Notification.requestPermission().then((res) => {
//   new Notification("App Started", {});
// });
</script>

<template>
  <Navbar v-model="viewHistory" />
  <main class="container pt-4">
    <template v-if="!viewHistory">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de aluguel</CardTitle>
          <CardDescription
            >Preencha os dados a baixo e veja o quando deve ser cobrado</CardDescription
          >
        </CardHeader>
        <CardContent class="flex gap-2">
          <div>
            <div class="grid w-full max-w-sm items-center gap-1.5 pb-2">
              <Label for="energy"> Luz: </Label>
              <Input
                id="energy"
                type="number"
                v-model="newRequest.bills.energy"
                placeholder="R$ 00.00"
                class="col-span-3 max-w-xs"
              />
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5 pb-2">
              <Label for="water">Água: </Label>
              <Input
                id="water"
                type="number"
                v-model="newRequest.bills.water"
                placeholder="R$ 00.00"
                class="max-w-xs"
              />
            </div>
            <p class="py-2 text-base">Distribuição por pessoas</p>
            <div class="flex gap-3">
              <div class="flex max-w-sm items-center gap-1.5">
                <Label for="residents">Casa</Label>
                <Input
                  id="residents"
                  type="number"
                  v-model="newRequest.bills.distribution[0]"
                  placeholder="1"
                  class="max-w-28"
                />
              </div>
              <div class="flex w-full max-w-sm items-center gap-1.5">
                <Label for="renteds">Aluguel</Label>
                <Input
                  id="renteds"
                  type="number"
                  v-model="newRequest.bills.distribution[1]"
                  placeholder="1"
                  class="max-w-28"
                />
              </div>
            </div>
            <div class="grid w-full max-w-sm items-center gap-1.5 pb-2 mt-1">
              <p class="pt-2 text-base">Outros custos</p>
              <div
                class="flex items-center gap-2"
                v-for="(cost, index) in newRequest.additionalCosts"
                :key="index"
              >
                <template v-if="cost.onEdit">
                  <Input type="text" v-model="cost.label" placeholder="Descrição" />
                  <Input
                    id=""
                    type="number"
                    v-model="cost.value"
                    placeholder="R$ 00.00"
                    class="col-span-3 max-w-xs"
                  />
                  <Button
                    @click="alternateEditCost(index)"
                    variant="outline"
                    size="icon"
                    class="aspect-square"
                  >
                    <Icon icon="mdi-check" />
                  </Button>
                </template>
                <template v-else> {{ cost.label }}: {{ cost.value }} </template>

                <Button
                  @click="removeCost(index)"
                  variant="outline"
                  size="icon"
                  class="aspect-square"
                >
                  <Icon icon="mdi-close" />
                </Button>
              </div>
              <Button @click="addCost">Adicionar custos</Button>
            </div>
          </div>
          <div class="flex">
            <Separator class="w-0.5" orientation="vertical" />
          </div>
          <div class="flex flex-col gap-1 p-4">
            <TooltipProvider v-for="(item, i) in sideNav" :key="i">
              <Tooltip :delayDuration="300">
                <TooltipTrigger as-child>
                  <Button
                    size="icon"
                    @click="item.isOpen = !item.isOpen"
                    :variant="item.isOpen ? 'outline' : ''"
                  >
                    <Icon class="size-5" :icon="item.icon"></Icon>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ item.tootip }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div class="relative">
            <template v-if="sideNav[0].isOpen">
              <Card class="p-4 text-pretty">
                <TooltipProvider>
                  <Tooltip :delayDuration="300">
                    <TooltipTrigger as-child>
                      <Button
                        @click="copyToClipClipboard(template)"
                        size="icon"
                        class="absolute right-4 z-10"
                      >
                        <Icon icon="mdi:content-copy" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copiar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Textarea
                  v-model="template"
                  class="resize-none leading-normal border-none"
                  :rows="8 + additionalCostsSize"
                />
              </Card>
            </template>
          </div>
        </CardContent>
        <CardFooter>
          <div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label class="text-base" for="total"> Total Aluguel</Label>
              <Input
                id="total"
                type="text"
                v-model="newRequestTotal"
                placeholder="Total"
                disabled
                class="col-span-3 max-w-xs"
              />
            </div>
            <div class="pt-8 flex items-center gap-1.5">
              <TooltipProvider>
                <Tooltip :delayDuration="300">
                  <TooltipTrigger as-child>
                    <Button @click="saveRequest" variant="outline">
                      <template v-if="!saveRequestLoading"> Salvar </template>
                      <template v-else>
                        <ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
                      </template>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Salvar contas deste mês</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardFooter>
      </Card>
    </template>
    <template v-else>
      <CardTitle class="py-4 text-2xl">Histórico</CardTitle>
      <Card v-for="(month, index) in history" :key="index" class="mb-4">
        <CardContent class="flex gap-1 p-4">
          <Accordion class="flex-grow" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger class="font-semibold text-lg flex gap-6">
                <span
                  >{{ formatDate("long-noDay", month.date) }} | R$ {{ month.total }}</span
                >
                <div class="ml-auto flex-none">
                  <AlertDialog>
                    <AlertDialogTrigger
                      ><Icon icon="radix-icons:cross-1"
                    /></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          data relating to {{ "month TalTal" }}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction @click="console.log('closed')"
                          >Continue</AlertDialogAction
                        >
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </AccordionTrigger>

              <AccordionContent>
                {{ month }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </template>
  </main>
  <Toaster />
</template>
