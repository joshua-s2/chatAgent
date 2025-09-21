<template>
  <div
    class="min-h-screen bg-black-50 flex flex-col items-center justify-center p-6"
  >
    <Card v-if="!userName" class="w-full max-w-sm p-6 text-center">
      <CardHeader>
        <CardTitle class="text-lg">Welcome 👋</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="mb-3">What’s your name?</p>
        <Input
          v-model="tempName"
          placeholder="Enter your name"
          class="mb-3"
          @keyup.enter="saveName"
        />
        <Button @click="saveName">Continue</Button>
      </CardContent>
    </Card>

    <ClientOnly v-else>
      <Card class="w-full max-w-lg !max-h-[600px] flex flex-col">
        <div class="pt-2 px-4">
          <p>{{ greeting }} {{ userName }}</p>
        </div>
        <hr />
        <CardContent
          ref="chatContainer"
          class="flex-1 overflow-y-auto space-y-2 p-4"
          :style="{ maxHeight: '400px' }"
        >
          <div
            v-if="messages.length < 1"
            class="flex flex-col items-center justify-center h-full text-center"
          >
            <p>{{ greeting }}{{ userName ? `, ${userName}` : "" }}! 👋</p>
            <p>Do you need help with an order?</p>
            <p>Our Agent is available to assist...</p>
          </div>

          <div
            v-else
            v-for="(m, idx) in messages"
            :key="idx"
            class="flex"
            :class="m.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="px-3 py-2 rounded-2xl max-w-xs break-words"
              :class="
                m.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              "
            >
              {{ m.text }}
            </div>
          </div>
        </CardContent>

        <div class="flex items-center border-t p-3 gap-2">
          <Input
            v-model="userMessage"
            placeholder="Type a message..."
            class="flex-1"
            @keyup.enter="sendMessage"
          />
          <Button @click="sendMessage" :disabled="loading"><Send /></Button>
        </div>
      </Card>
    </ClientOnly>

    <div v-if="userName" class="mt-8 justify-start">
      <Button>
        <NuxtLink to="/workflow">Update workflow policy</NuxtLink>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Send } from "lucide-vue-next";
import moment from "moment";

const userMessage = ref("");
const messages = ref<{ sender: "user" | "ai"; text: string }[]>([]);
const userName = ref("");
const tempName = ref("");
const greeting = ref("Hello");
const loading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const { $snackbar } = useNuxtApp();
const config = useRuntimeConfig();
const API_BASE = config.public.apiBase;

const sessionId = ref("");

function setGreeting() {
  const hour = moment().hour();
  if (hour >= 5 && hour < 12) greeting.value = "Good morning";
  else if (hour >= 12 && hour < 18) greeting.value = "Good afternoon";
  else greeting.value = "Good evening";
}

function saveName() {
  if (!tempName.value.trim()) return;
  userName.value = tempName.value.trim();
  if (process.client) localStorage.setItem("chat_user_name", userName.value);
  loadHistory();
}

async function loadHistory() {
  if (!userName.value || !sessionId.value) return;

  try {
    const res = await fetch(`${API_BASE}/api/chats/${sessionId.value}`);
    if (res.ok) {
      const data = await res.json();
      messages.value = data.flatMap((m: any) => [
        { sender: "user", text: m.message },
        { sender: "ai", text: m.response },
      ]);

      await nextTick();
      scrollToBottom();
    }
  } catch (err: any) {
    console.error("Failed to load chat history:", err);
    $snackbar.error("Failed to load chat history.");
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

const sendMessage = async () => {
  if (!userMessage.value.trim() || !sessionId.value) return;

  messages.value.push({ sender: "user", text: userMessage.value });
  scrollToBottom();

  try {
    loading.value = true;
    const res = await fetch(`${API_BASE}/api/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId.value,
        message: userMessage.value,
      }),
    });

    const data = await res.json();
    loading.value = false;

    if (data.response?.startsWith("LLM Error")) {
      $snackbar.error(data.response);
      messages.value.push({ sender: "ai", text: "⚠️ LLM Error occurred" });
    } else {
      messages.value.push({
        sender: "ai",
        text: data.response || "No response",
      });
    }

    await nextTick();
    scrollToBottom();
  } catch (err: any) {
    console.error(err);
    $snackbar.error("Error connecting to server.");
  }

  userMessage.value = "";
};

onMounted(() => {
  if (process.client) {
    sessionId.value = localStorage.getItem("chat_session_id") || "";
    if (!sessionId.value) {
      sessionId.value = "sess-" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("chat_session_id", sessionId.value);
    }

    userName.value = localStorage.getItem("chat_user_name") || "";
  }

  setGreeting();
  if (userName.value) loadHistory();
});
</script>
