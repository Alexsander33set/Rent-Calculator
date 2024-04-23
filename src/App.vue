<script setup>
import { ref, computed } from "vue";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Navbar from "@/components/layout/Navbar.vue";

const viewHistory = ref(false);
const newRequest = ref({
  energy: "",
  water: "",
  distribution: [1, 1],
  variations: 0,
  isPaid: false,
  date: Date.now(),
});

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
    <template v-if="viewHistory"> viewHistory </template>
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
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="energy">Distribution</Label>
            Home
            <Input
              id="residents"
              type="number"
              v-model="newRequest.distribution[0]"
              placeholder="1"
              class="col-span-3 max-w-xs"
            />
            Rented
            <Input
              id="renteds"
              type="number"
              v-model="newRequest.distribution[1]"
              placeholder="1"
              class="col-span-3 max-w-xs"
            />
          </div>
        </CardContent>
        <CardFooter>
          <div class="grid w-full max-w-sm items-center gap-1.5">
            <Label for="total"> Total Dispesas Aluguel: </Label>
            <Input
              id="total"
              type="text"
              v-model="newRequestTotal"
              placeholder="Total"
              disabled
              class="col-span-3 max-w-xs"
            />
          </div>
        </CardFooter>
      </Card>

      <div class="grid place-content-center gap-4 py-4 border rounded-m"></div>
    </template>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
