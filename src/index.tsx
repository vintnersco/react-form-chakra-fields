import ReactSelect from 'react-select';
import { Box, Checkbox, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Select, Spacer, Stack, StackProps, Switch, Textarea } from "@chakra-ui/react";
import React, { ReactElement, ReactNode } from "react";
import { FieldComponentProps } from "@vintners/react-form";

function ChakraField({ id, label, help, error, isReadOnly, isRequired, isDisabled, isHorizontal, helpAlignment, children }: {
    isReadOnly?: boolean,
    isDisabled?: boolean,
    isRequired?: boolean,
    isHorizontal?: boolean
    id?: string;
    label?: string | ReactElement,
    help?: string | ReactElement,
    error: string | null,
    helpAlignment?: 'top' | 'bottom',
    children: ReactNode | ReactNode[]
}) {
    let labelProps: any, fieldProps: any;
    if (isHorizontal) {
        labelProps = { md: 0, pr: 2 };
        fieldProps = { display: 'flex', aligItems: 'center', justifyContent: 'start' };
    }
    const helpOnTop = helpAlignment === 'top';
    return (
        <FormControl isRequired={isRequired} isInvalid={!!error} isDisabled={isDisabled} isReadOnly={isReadOnly} {...fieldProps}>
            {label && <FormLabel htmlFor={id} {...labelProps}>{label}</FormLabel>}
            {helpOnTop && help && <FormHelperText>{help}</FormHelperText>}
            {children}
            {!helpOnTop && help && <FormHelperText>{help}</FormHelperText>}
            <FormErrorMessage>{error || ''}</FormErrorMessage>
        </FormControl>
    )
}

export function createInputField(type: string, stringify: (value: any) => string = (value) => value || '') {
    return function InputField({ id, name, value, onChange, onBlur, placeholder, autoComplete, ...others }: FieldComponentProps) {
        return (
            <ChakraField id={id} {...others}>
                <Input
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={stringify(value)}
                    type={type}
                    id={id}
                    placeholder={placeholder}
                    autoComplete={autoComplete || 'off'}
                />
            </ChakraField>
        )
    }
}

export const TextField = createInputField('text');
export const PasswordField = createInputField('password');
export const EmailField = createInputField('email');
export const DateField = createInputField('date', (date) => date ? date.toISOString().split('T')[0] : '');


export function createNumberField({ step }: { step?: number }) {
    return function NumberField({ id, name, value, onChange, onBlur, placeholder, autoComplete, ...others }: FieldComponentProps) {
        return (
            <ChakraField id={id}  {...others}>
                <NumberInput
                    id={id}
                    step={!step ? undefined : step}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    value={value || ''}
                >
                    <NumberInputField
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                    />
                    {
                        step && <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    }
                </NumberInput>
            </ChakraField>
        )
    }
}

export const NumberField = createNumberField({});


export function TextareaField({ id, name, value, onChange, onBlur, placeholder, autoComplete, ...others }: FieldComponentProps) {
    return (
        <ChakraField id={id}  {...others}>
            <Textarea
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                value={value || ''}
                id={id}
                placeholder={placeholder}
                autoComplete={autoComplete}
            />
        </ChakraField>
    )
}


export function CheckboxField({ id, name, value, onChange, onBlur, placeholder, autoComplete,
    error, label, help,
    isRequired, isReadOnly, isDisabled
}: FieldComponentProps) {
    const labelOpts = { mb: 0, fontWeight: 'normal', cursor: 'pointer' };
    return (
        <FormControl isRequired={isRequired} isInvalid={!!error} isDisabled={isDisabled} isReadOnly={isReadOnly}>
            <Checkbox
                id={id}
                name={name}
                value='true'
                onChange={onChange}
                onBlur={onBlur}
                isChecked={value === true}
            >
                <FormLabel {...labelOpts}>{label}</FormLabel>
            </Checkbox>
            {help && <FormHelperText>{help}</FormHelperText>}
            <FormErrorMessage>{error || ''}</FormErrorMessage>
        </FormControl>
    )
}

function createSwitchField({ reverse, spacing = 2 }: { reverse?: boolean, spacing?: number }) {
    return function SwitchField({ id, name, value, onChange, onBlur, placeholder, autoComplete,
        error, label, help,
        isRequired, isReadOnly, isDisabled
    }: FieldComponentProps) {
        const labelOpts = { mb: 0, mr: 0, ml: 0, mt: 0, fontWeight: 'normal', cursor: 'pointer' };
        return (
            <FormControl isRequired={isRequired} isInvalid={!!error} isDisabled={isDisabled} isReadOnly={isReadOnly}>
                <Flex alignItems='center' justifyContent='start' direction={reverse ? 'row-reverse' : 'row'}>
                    <FormLabel {...labelOpts}>{label}</FormLabel>
                    <Box width={spacing} />
                    <Switch
                        id={id}
                        name={name}
                        value='true'
                        onChange={onChange}
                        onBlur={onBlur}
                        isChecked={value === true}
                    />
                </Flex>
                {help && <FormHelperText>{help}</FormHelperText>}
                <FormErrorMessage>{error || ''}</FormErrorMessage>
            </FormControl>
        )
    }
}

export const SwitchField = createSwitchField({ reverse: false });
export const ReversedSwitchField = createSwitchField({ reverse: true });


export function SelectField({ id, name, value, onChange, onBlur, placeholder, autoComplete, options, isRequired, ...others }: FieldComponentProps) {

    if (!options) {
        throw new Error('SelectField requires an options array');
    }

    if (value == null) {
        options = [{ value: '', label: placeholder || 'Select...' }].concat(options);
        value = '';
    }

    return (
        <ChakraField id={id} {...others}>
            <Select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                autoComplete={autoComplete}
            >
                {
                    options?.map(opt => <option value={opt.value} key={opt.value}>{opt.label}</option>)
                }
            </Select>
        </ChakraField>
    )
}

function createRadioFroupField(stackProps?: StackProps) {
    return function RadioGroupField({ id, name, value, onChange, onBlur, placeholder, autoComplete, options, isRequired, ...others }: FieldComponentProps) {
        return (
            <ChakraField id={id} {...others}>
                <RadioGroup id={id} name={name} value={value} onChange={onChange} onBlur={onBlur}>
                    <Stack {...stackProps}>
                        {
                            options?.map(opt => <Radio value={opt.value} key={opt.value}>{opt.label}</Radio>)
                        }
                    </Stack>
                </RadioGroup>
            </ChakraField>
        )
    }
}

export const RadioGroupField = createRadioFroupField();
export const InlineRadioGroupField = createRadioFroupField({ direction: 'row' });

export function createSelectField({ isClearable }: {
    isClearable?: true
}) {
    return function ReactSelectField({ id, name, value, onChange, onBlur, placeholder, autoComplete, options, isRequired, ...others }: FieldComponentProps) {
        const _onChange = (item: { value: string, label: string } | null) => {
            onChange(item ? item.value : null);
        }
        return (
            <ChakraField id={id} {...others}>
                <ReactSelect<{ value: string, label: string }, false>
                    id={id}
                    name={name}
                    value={value ? options?.find(opt => opt.value === value) || null : null}
                    onChange={_onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    isClearable={isClearable || false}
                    options={options || []}
                />
            </ChakraField>
        )
    }
}

export function createMultiSelectField({ isClearable }: {
    isClearable?: true
}) {
    return function ReactSelectField({ id, name, value, onChange, onBlur, placeholder, autoComplete, options, isRequired, ...others }: FieldComponentProps) {
        if (!value) {
            value = [];
        }
        const valueSet = new Set(value);
        const _onChange = (items: readonly { value: string, label: string }[]) => {
            onChange(items ? items.map(item => item.value) : null);
        }
        return (
            <ChakraField id={id} {...others}>
                <ReactSelect<{ value: string, label: string }, true>
                    isMulti={true}
                    id={id}
                    name={name}
                    value={options?.filter(opt => valueSet.has(opt.value))}
                    onChange={_onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    isClearable={isClearable || false}
                    options={options || []}
                />
            </ChakraField>
        )
    }
}
