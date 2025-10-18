<template>
  <div
    class="min-h-screen bg-black-50 flex flex-col items-center justify-center p-6"
  >
    <Card class="w-full max-w-xl flex">
      <CardHeader>
        <CardTitle class="text-s1">Workflow Editor</CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <Form
          :validation-schema="schema"
          :initial-values="initialValues"
          @submit="onSubmit"
        >
          <div>
            <label class="block text-sm font-medium mb-1">Workflow Name</label>
            <Field name="name" v-slot="{ field, errorMessage }">
              <Input v-bind="field" placeholder="e.g. Refund Policy" />
              <p v-if="errorMessage" class="text-red-500 text-xs mt-1">
                {{ errorMessage }}
              </p>
            </Field>
          </div>

          <div class="my-5">
            <label class="block text-sm font-medium mb-1">
              Policy / Instructions
            </label>
            <Field name="policy" v-slot="{ field, errorMessage }">
              <Textarea
                v-bind="field"
                placeholder="Describe how the AI should handle this workflow..."
                class="min-h-[120px]"
              />
              <p v-if="errorMessage" class="text-red-500 text-xs mt-1">
                {{ errorMessage }}
              </p>
            </Field>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">Enable Escalation</label>
            <Field name="escalation" v-slot="{ value, handleChange }">
              <Switch :checked="value" @update:checked="handleChange" />
            </Field>
          </div>

          <p v-if="message" class="text-sm text-gray-700 mt-2">{{ message }}</p>

          <Button class="w-full mt-4" :disabled="loading" type="submit">
            {{ loading ? "Saving..." : "Save Workflow" }}
          </Button>
        </Form>
      </CardContent>
    </Card>

    <div class="my-4 justify-start">
      <NuxtLink to="/chat" class="hover:underline">Chat with agent</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

const { $snackbar } = useNuxtApp();
const router = useRouter();
const config = useRuntimeConfig();
const API_BASE = config.public.apiBase;

const loading = ref(false);
const message = ref("");

const schema = toTypedSchema(
  z.object({
    name: z
      .string()
      .trim()
      .min(1, "Workflow name is required")
      .max(100, "Workflow name is too long"),
    policy: z
      .string()
      .trim()
      .min(1, "Policy instructions are required")
      .max(5000, "Policy text is too long"),
    escalation: z.boolean().optional(),
  })
);

const initialValues = {
  name: "",
  policy: "",
  escalation: false,
};

const onSubmit = async (values: any) => {
  loading.value = true;
  message.value = "";

  try {
    const res = await fetch(`${API_BASE}/api/workflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      const data = await res.json();
      $snackbar.show(`Workflow "${data.workflow.name}" saved successfully!`);
      router.push("/chat");
    } else {
      const errText = await res.text();
      $snackbar.error(`Failed to save workflow: ${errText}`);
    }
  } catch (err) {
    $snackbar.error(String(err));
  } finally {
    loading.value = false;
  }
};
</script>
