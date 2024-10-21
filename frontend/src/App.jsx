import { Route, Routes } from "react-router-dom";

import IndexPage from "./pages/IndexPage";
import Layout from "./layout/Layout";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage/CreatePostPage";
import DetailsPostPage from "./pages/DetailsPostPage/DetailsPostPage";
import EditPostPage from "./pages/EditPostPage/EditPostPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { UserContentProvider } from "./context/UserContext";

function App() {
  return (
    <UserContentProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<DetailsPostPage />} />
          <Route path="/edit/:id" element={<EditPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </UserContentProvider>
  );
}

export default App;
