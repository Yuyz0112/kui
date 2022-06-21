import { libs, dependencies } from "./sunmao/lib";
import registerSunmaoApp from "./SunmaoApp";
import lcm from "./sunmao/lcm.json";
import mt from "./sunmao/mt.json";
import type { Schema } from "./types";
import "./init";

function App() {
  const search = new URLSearchParams(location.search);
  const schema = ({
    mt,
    lcm,
  } as Record<string, Schema>)[search.get("app") || "lcm"];
  const Page = registerSunmaoApp(schema, {
    libs,
    dependencies,
  });

  return <Page />;
}

export default App;
