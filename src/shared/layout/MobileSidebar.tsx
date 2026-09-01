// import { useRef } from "react"
// import { Link } from "react-router-dom"
// import { SidebarComponent } from '@syncfusion/ej2-react-navigations'
// import { Sidebar as SidebarBase } from '@syncfusion/ej2-navigations'
// import { Sidebar } from "./Sidebar"

// type SidebarInstance = SidebarComponent & SidebarBase

// const MobileSidebar = () => {
//   const sidebarRef = useRef<SidebarInstance>(null)

//   return (
//     <SidebarComponent
//       ref={sidebarRef as any}
//       width={270}
//       type="Over"
//       target=".app-shell-body"
//       closeOnDocumentClick={true}
//       showBackdrop={true}
//       created={() => sidebarRef.current?.hide()}
//     >
//       <Sidebar handleClick={() => sidebarRef.current?.hide()} />
//     </SidebarComponent>
//   )
// }


// export default MobileSidebar