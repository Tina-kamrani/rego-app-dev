import { useEffect, useState } from "react";
import { Stack, useRouter, usePathname, Href } from "expo-router";
import { handleSSORequest } from "@/src/core/server";
import * as Linking from "expo-linking";
import { generatePKCE } from "@/src/utils/pkceUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values';

export default function AppLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [pendingDeepLink, setPendingDeepLink] = useState<string | null>(null);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      const parsed = Linking.parse(url);

      if (parsed.hostname === "index") {
        router.dismissAll();
        return;
      }

      if (parsed.path && typeof parsed.path === "string") {
        const sanitizedPath = `/${parsed.path}` as Href<string>;
        if (pathname !== sanitizedPath) {
          router.push(sanitizedPath);
        }
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
