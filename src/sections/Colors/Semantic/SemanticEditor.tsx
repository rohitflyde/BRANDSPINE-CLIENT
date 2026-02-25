import SemanticColorGrid from "../SemanticColorGrid";

type Props = {
  mode: "light" | "dark";
};

export default function SemanticEditor({ mode }: Props) {
  return (
    <div className="mt-6">
      <SemanticColorGrid mode={mode} />
    </div>
  );
}
