const { defineComponent } = Vue;

export const FormElement = defineComponent({
  name: "FormElement",
  props: {
    modelValue: { type: [String, Number], default: "" },
    label: { type: String, required: true },
    id: { type: String, required: true },
    type: { type: String, default: "text" }, // text, mask, number, textarea
    icon: { type: String, default: "" },
    mask: { type: String, default: null },
    error: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  setup(_, { emit }) {
    const onInput = (e) => {
      emit("update:modelValue", e.target.value);
    };

    return { onInput };
  },
  template: `
    <div class="form-element">
        <p-inputgroup>
            <p-inputgroupaddon>
                <span v-if="icon" class="material-symbols-outlined">{{ icon }}</span>
            </p-inputgroupaddon>

            <p-floatlabel variant="on">
                <p-inputtext v-if="type==='text'" :id="id" :type="type"
                    :value="modelValue" @input="onInput"
                    :invalid="!!error"
                ></p-inputtext>

                <p-inputnumber v-else-if="type==='number'" :id="id"
                    :value="modelValue" @input="onInput"
                    :invalid="!!error"
                ></p-inputnumber>

                <p-inputmask v-else-if="type==='mask'" :id="id" :mask="mask"
                    :value="modelValue" @input="onInput"
                    :invalid="!!error"
                ></p-inputmask>

                <p-textarea v-else-if="type==='textarea'" :id="id"
                    :value="modelValue" @input="onInput"
                    fluid autoResize
                    :invalid="!!error"
                ></p-textarea>

                <label :for="id">{{ label }}</label>
            </p-floatlabel>
        </p-inputgroup>

        <p-message v-if="!!error" severity="error" size="small" variant="simple">{{ error }}</p-message>
    </div>
    `
});
