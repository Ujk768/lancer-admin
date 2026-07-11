// import { createContext, useCallback, useContext, useState } from "react";

// // App-wide toast system. Every recoverable error surfaces here as a small
// // dismissible message instead of crashing the page. Success confirmations use
// // the same channel so feedback is consistent.

// const ToastContext = createContext(null);

// let counter = 0;

// export function ToastProvider({ children }:) {
//   const [toasts, setToasts] = useState([]);

//   const dismiss = useCallback((id) => {
//     setToasts((t) => t.filter((x) => x.id !== id));
//   }, []);

//   const push = useCallback(
//     (kind, title, message) => {
//       const id = ++counter;
//       setToasts((t) => [...t.slice(-3), { id, kind, title, message }]);
//       setTimeout(() => dismiss(id), 5200);
//     },
//     [dismiss]
//   );

//   const api = {
//     error: (message: string, title = "Something went wrong") => push("error", title, message),
//     success: (message: string, title = "Done") => push("success", title, message),
//     info: (message: string, title = "Heads up") => push("info", title, message),
//   };

//   return (
//     <ToastContext.Provider value={api}>
//       {children}
//       <div className="toast-stack" role="status" aria-live="polite">
//         {toasts.map((t) => (
//           <div key={t.id} className={`toast ${t.kind}`}>
//             <div className="toast-body">
//               <div className="toast-title">{t.title}</div>
//               <div className="toast-msg">{t.message}</div>
//             </div>
//             <button onClick={() => dismiss(t.id)} aria-label="Dismiss message">&times;</button>
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// }

// export function useToast() {
//   const ctx = useContext(ToastContext);
//   if (!ctx) throw new Error("useToast must be used inside ToastProvider");
//   return ctx;
// }
