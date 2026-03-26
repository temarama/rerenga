// Load grammar JSON
let grammar = {}; 

async function loadGrammar(url) {
  const response = await fetch(url);
  grammar = await response.json();
}

// Expand a rule by name
function expand(ruleName) {
  const rule = grammar[ruleName.replace(/[<>]/g, "")];

  if (!rule) {
    console.warn("Unknown rule:", ruleName);
    return ruleName;
  }

  switch (rule.type) {
    case "list":
      return expandList(rule);
    case "category":
      return expandCategory(rule);
    case "sequence":
      return expandSequence(rule);
    default:
      console.warn("Unknown rule type:", rule.type);
      return "";
  }
}

// Expand a list (simple random choice)
function expandList(rule) {
  const choice = random(rule.options);
  return expandText(choice);
}

// Expand a category (also random choice, but may contain logic)
function expandCategory(rule) {
  const choice = random(rule.options);

  // Handle if/then/else logic
  if (typeof choice === "object" && choice.if) {
    const condition = evaluateCondition(choice.if);
    const branch = condition ? choice.then : choice.else;
    return expandText(branch);
  }

  return expandText(choice);
}

// Expand a sequence (concatenate parts)
function expandSequence(rule) {
  const joiner = rule.join !== undefined ? rule.join : " ";

  return rule.parts
    .map(part => expandText(part))
    .join(joiner)
    .trim();
}

// Expand text containing <subrules>
function expandText(text) {
  if (typeof text !== "string") return text;

  return text.replace(/<[^>]+>/g, match => expand(match));
}

// Random helper
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Dummy condition evaluator (you can extend this)
function evaluateCondition(name) {
  if (name === "two_names") {
    return Math.random() < 0.5;
  }
  return false;
}

// Load grammar JSON
loadGrammar("grammar.json").then(() => {
  document.getElementById("gen").onclick = () => {
  let results = [];

  for (let i = 0; i < 10; i++) {
    results.push(expand("rerenga_poto"));
  }
  document.getElementById("output").textContent = results.join("\n");
};
});