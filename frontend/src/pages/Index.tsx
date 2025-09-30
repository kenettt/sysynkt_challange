import { FamilyPlanner } from "@/components/FamilyPlanner";
import type { User } from "@/types";

const fakeLogin = {
  id: 2,
  name: "Dad",
  role: "dad",
} as User;

const Index = () => {
  return <FamilyPlanner user={fakeLogin} />;
};

export default Index;
