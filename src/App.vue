<script setup>
import { ref, computed } from "vue";
//* shadcn components
import { Icon } from "@iconify/vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-icons/vue";
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
import { useToast } from "@/components/ui/toast/use-toast";
import Toaster from "@/components/ui/toast/Toaster.vue";
const { toast } = useToast();

//* custom components
import Navbar from "@/components/layout/Navbar.vue";

const formatDate = (dateFormat, date = new Date()) => {
  let inputDate = new Date(date);
  if (dateFormat === "mm/yy") {
    // format mm/yy
    return inputDate.toLocaleDateString(undefined, {
      month: "2-digit",
      year: "2-digit",
    });
  } else if (dateFormat === "long-noDay") {
    return inputDate.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  } else {
    return inputDate.toLocaleDateString();
  }
};

const history = ref(JSON.parse(localStorage.getItem("history")));
const viewHistory = ref(false);

let saveRequestLoading = ref(false);
const newRequest = ref({
  energy: "",
  water: "",
  distribution: [1, 1],
  variations: 0,
  isPaid: false,
  date: Date.now(),
  total: 0,
});

//* REMOVE ====================
localStorage.setItem(
  "history",
  JSON.stringify([newRequest.value, newRequest.value, newRequest.value])
);

const saveRequest = () => {
  saveRequestLoading.value = true;
  let sameMonth = (dateOne, dateTwo) => {
    console.log(!!formatDate("mm/yy", dateOne) === formatDate("mm/yy", dateTwo));
    return !!formatDate("mm/yy", dateOne) === formatDate("mm/yy", dateTwo);
  };

  //* Validar campos, verificar se já existe, caso sim avisar e pedir certeza
  if (!history.value) {
    history.value = [];
    console.log("No history registered at localStorage ");
  }

  history.value.forEach((request, index) => {
    console.log(index);
    if (sameMonth(newRequest.value.date, request.date)) {
      console.log("sameMonth!");
    } else {
      history.value.push(newRequest)
      toast({ title: "Sucessfully saved ✅" });
    }
  });

  // getHistory.push(newRequest);
  // localStorage.setItem("history", JSON.stringify(getHistory));
};

const newRequestTotal = computed(() => {
  let distribution = newRequest.value.distribution;
  // (Home, rented)
  let totalPersons = distribution[0] + distribution[1];
  let homeExpenses = distribution[0] / totalPersons;
  let rentedExpenses = distribution[1] / totalPersons;
  console.log(rentedExpenses);
  return (newRequest.value.energy + newRequest.value.water) * rentedExpenses;
});
</script>

<template>
  <Navbar v-model="viewHistory" />
  <main class="container pt-4">
    <template v-if="viewHistory">
      <div class="py-4 text-2xl">History</div>
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
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <!-- <CardFooter></CardFooter> -->
      </Card>
    </template>
    <template v-else>
      <Card>
        <CardHeader>
          <CardTitle>Rent Calculator</CardTitle>
          <CardDescription>Calculate how much you need to charge</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="water">Água: </Label>
            <Input
              id="water"
              type="number"
              v-model="newRequest.water"
              placeholder="R$ 00.00"
              class="max-w-xs"
            />
          </div>
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="energy"> Luz: </Label>
            <Input
              id="energy"
              type="number"
              v-model="newRequest.energy"
              placeholder="R$ 00.00"
              class="col-span-3 max-w-xs"
            />
          </div>
          <p class="py-4 text-base">Distribution</p>
          <div class="flex gap-3">
            <div class="flex max-w-sm items-center gap-1.5">
              <Label>Home</Label>
              <Input
                id="residents"
                type="number"
                v-model="newRequest.distribution[0]"
                placeholder="1"
                class="max-w-28"
              />
            </div>
            <div class="flex w-full max-w-sm items-center gap-1.5">
              <Label>Rented</Label>
              <Input
                id="renteds"
                type="number"
                v-model="newRequest.distribution[1]"
                placeholder="1"
                class="max-w-28"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div>
            <div class="grid w-full max-w-sm items-center gap-1.5">
              <Label class="text-base" for="total"> Total Rent Expenses</Label>
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
              <Button @click="saveRequest" variant="outline" class="max-w-24">
                <template v-if="!saveRequestLoading"> Save </template>
                <template v-else>
                  <ReloadIcon class="w-4 h-4 mr-2 animate-spin" />
                </template>
              </Button>
              <Button class="max-w-24">Export</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </template>
  </main>
  <Toaster />
</template>
