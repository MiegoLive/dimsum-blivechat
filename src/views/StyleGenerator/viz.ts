import { ref, Ref, watch, Component, markRaw, nextTick } from "vue";
import { ElColorPicker, ElInput, ElSelect } from "element-plus";
import StringSlider from "./StringSlider.vue";
import StringInputNumber from "./StringInputNumber.vue";
import StringSwitch from "./StringSwitch.vue";
import FontSelect from "./FontSelect.vue";
import { debounce } from "../../utils";

interface VizItem {
  reg: RegExp;
  type: string;
  label: string;
  meta: string;
  property: string;
  value: string;
  component: Component;
  bind: any;
}

function getComponent(
  type: string,
  meta?: string
): { component: Component; bind: any } {
  type = type.trim();
  meta = meta?.trim() || "";
  let component: Component = markRaw(ElInput);
  let bind = undefined;
  switch (type) {
    case "color":
      component = markRaw(ElColorPicker);
      bind = {
        "show-alpha": true,
      };
      break;
    case "input":
      component = markRaw(ElInput);
      break;
    case "select":
      component = markRaw(ElSelect);
      bind = {
        options: meta.split(",").map((s) => {
          return { value: s.trim() };
        }),
      };
      break;
    case "slider":
      component = markRaw(StringSlider);
      bind = {
        min: parseFloat(meta.split(",")[0].trim()),
        max: parseFloat(meta.split(",")[1].trim()),
      };
      break;
    case "number":
      component = markRaw(StringInputNumber);
      break;
    case "switch":
      component = markRaw(StringSwitch);
      bind = {
        falseValue: meta.split(",")[0].trim(),
        trueValue: meta.split(",")[1].trim(),
      };
      break;
    case "font":
      component = markRaw(FontSelect);
      break;
    default:
      break;
  }
  return { component, bind };
}

export function useViz(css: Ref<string>) {
  const RE =
    /(\/\*\s*@viz\s+([^|]+)\|([^*]*?)\s*\*\/)\s*[\r\n]+\s*(--[\w-]+)\s*:\s*([^;]*);?/g;

  const vizItems = ref<VizItem[]>([]);
  let lockCss = false;
  let lockItems = false;

  function parseCssToItems() {
    if (lockCss) return;
    lockItems = true;
    const newVizItems: VizItem[] = [];
    let match: RegExpExecArray | null;
    while ((match = RE.exec(css.value)) !== null) {
      const [full, _raw, type, labelnMeta, property, value] = match;
      const wildBlock = '(' + full
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')  // 整体转义
      .replace(/(:\s*)[^;]*(\s*;?)/, '$1)([^;]*)($2)'); // 只把值部分包成捕获组
      const reg = new RegExp(wildBlock, "g"); // 全局只匹配自己
      const [label, meta = ""] = labelnMeta.split("|");
      const { component, bind } = getComponent(type.trim(), meta.trim());
      const newVizItem = {
        reg: reg,
        type: type.trim(),
        label: label.trim(),
        meta: meta.trim(),
        property: property.trim(),
        value: value.trim(),
        component,
        bind,
      };
      newVizItems.push(newVizItem);
    }
    vizItems.value = newVizItems;
    nextTick(() => (lockItems = false));
  }

  function writeItemToCss() {
    if (lockItems) return;
    lockCss = true;
    let newCss = css.value;
    vizItems.value.forEach((item) => {
      newCss = newCss.replace(item.reg, `$1${item.value}$3`);
    });
    css.value = newCss;
    nextTick(() => (lockCss = false));
  }

  const debouncedParseCssToItems = debounce(parseCssToItems, 500);
  const debouncedWriteItemToCss = debounce(writeItemToCss, 500);

  watch(css, ()=>{
    if (lockCss) return;
    debouncedParseCssToItems();
  }, { immediate: true });
  watch(vizItems, () => {
    if (lockItems) return;
    debouncedWriteItemToCss();
  }, { deep: 2 });

  return { vizItems };
}
