// import SidebarNotes from "./@sidebar/default";
// import css from "./LayoutNotes.module.css";

// export default function FilterLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
//   sidebar: React.ReactNode;
// }>) {
//   return (
//     <section className={css.container}>
//       <aside className={css.sidebar}>
//         <SidebarNotes />
//       </aside>
//       <div className={css.notesWrapper}>{children}</div>
//     </section>
//   );
// }
import css from "./LayoutNotes.module.css";

export default function FilterLayout({
  children,
  sidebar, // 1. Деструктуруємо проп sidebar, який Next.js передає сюди автоматично
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>
        {/* 2. Рендеримо слот як проп. Жодних ручних імпортів компонента! */}
        {sidebar}
      </aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
}
