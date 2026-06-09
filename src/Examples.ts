type Example = {
  label: string;
  url: string;
};

const BASE =
  "https://cdn.jsdelivr.net/gh/elenamolino/odrl-validator@main/data/elena-test/";

export const examples: Example[] = [
  {
    label: "❌ Empty policy (invalid)",
    url: BASE + "test-00-invalid-empty-policy.ttl"
  },
  {
    label: "❌ Permission + prohibition (invalid)",
    url: BASE + "test-01-invalid-policy-permission-prohibition.ttl"
  },
  {
    label: "✅ Permission + prohibition (valid)",
    url: BASE + "test-02-valid-policy-permission-prohibition.ttl"
  },
  {
    label: "❌ Conflict (permission vs prohibition)",
    url: BASE + "test-03-invalid-policy-conflicts-perm-prohibition.ttl"
  },
  {
    label: "✅ No conflict (permission vs prohibition)",
    url: BASE + "test-04-valid-policy-no-conflicts-perm-prohibition.ttl"
  },
  {
    label: "⚠️ Inconsistent (permission vs prohibition)",
    url: BASE + "test-05-inconsistent-policy-perm-prohibition.ttl"
  },
  {
    label: "⚠️ Inconsistent (with duty conflict)",
    url: BASE + "test-06-inconsistent-policy-perm-prohibition-duty.ttl"
  }
];