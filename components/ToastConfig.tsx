import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#16a34a",
        backgroundColor: "#f0fdf4",
        borderRadius: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#166534",
      }}
      text2Style={{
        fontSize: 14,
        color: "#15803d",
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#dc2626",
        backgroundColor: "#fef2f2",
        borderRadius: 12,
      }}
      text1Style={{
        fontSize: 16,
        fontWeight: "700",
        color: "#991b1b",
      }}
      text2Style={{
        fontSize: 14,
        color: "#b91c1c",
      }}
    />
  ),
};