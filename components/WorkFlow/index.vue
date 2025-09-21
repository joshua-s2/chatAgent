<template>
  <div
    class="min-h-screen bg-black-50 flex flex-col items-center justify-center p-6"
  >
    <Card class="w-full max-w-xl flex">
      <CardHeader>
        <CardTitle class="text-s1">Workflow Editor</CardTitle>
      </CardHeader>

      <CardContent class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Workflow Name</label>
          <Input v-model="workflowName" placeholder="e.g. Refund Policy" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1"
            >Policy / Instructions</label
          >
          <Textarea
            v-model="policyText"
            placeholder="Describe how the AI should handle this workflow..."
            class="min-h-[120px]"
          />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">Enable Escalation</span>
          <Switch v-model="escalationEnabled" />
        </div>

        <p v-if="message" class="text-sm text-gray-700">{{ message }}</p>
      </CardContent>

      <CardFooter>
        <Button class="w-full" :disabled="loading" @click="saveWorkflow">
          {{ loading ? "Saving..." : "Save Workflow" }}
        </Button>
      </CardFooter>
    </Card>

    <div class="my-4 justify-start">
      <NuxtLink to="/chat" class="hover:underline"> Chat with agent </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const workflowName = ref("");
const policyText = ref("");
const escalationEnabled = ref(false);
const loading = ref(false);
const message = ref("");

const { $snackbar } = useNuxtApp();
const config = useRuntimeConfig();
const API_BASE = config.public.apiBase;

const saveWorkflow = async () => {
  loading.value = true;
  message.value = "";

  try {
    const res = await fetch(`${API_BASE}/api/workflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workflowName.value,
        policy: policyText.value,
        escalation: escalationEnabled.value,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      $snackbar.show(`Workflow "${data.name}" saved successfully!`);

      workflowName.value = "";
      policyText.value = "";
      escalationEnabled.value = false;
    } else {
      $snackbar.error("Failed to save workflow.");
    }
  } catch (err) {
    $snackbar.error(String(err));
  } finally {
    loading.value = false;
  }
};
</script>
