import React from "react";
import { Button } from "@chayns-components/core";
import { dialog } from "chayns-api";
import { SelectDialogItem } from "chayns-api/dist/types/types/dialog";

export const SelectButton = (props: {
	/**
	 * A callback that is invoked when the selection has changed.
	 */
	onSelect?: (e: any) => void;

	/**
	 * A string that will be shown as a title in the selection dialog.
	 */
	title?: string;

	/**
	 * A string that will be shown as a description in the selection dialog.
	 */
	description?: string;

	/**
	 * The content of the button.
	 */
	label?: string;

	/**
	 * An array of items to select from. Items are provided in an object shape.
	 */
	list: any[];

	/**
	 * The property name of the list item objects that will uniquely identify each one.
	 */
	listKey?: string;

	/**
	 * The property name of the list item objects that will be shown as its name in the selection dialog.
	 */
	listValue?: string;

	/**
	 * The property name of the list item objects that mark an item as selected.
	 */
	selectedFlag?: string;

	/**
	 * Wether multiple options can be selected.
	 */
	multiSelect?: boolean;

	/**
	 * Wether a search field should be shown in the selection dialog.
	 */
	quickFind?: boolean;

	/**
	 * Adds a checkbox with the given text of this property which allows you to enable and disable all elements of the select list at the same time. Based on the list items isSelected state the checkbox is enabled or disabled. If all elements of the list are selected, the checkbox will be checked.
	 */
	selectAllButton?: string;

	/**
	 * A classname string that will be applied to the button.
	 */
	className?: string;

	/**
	 * Wether the current selection should be shown in the button. Use a number to specify the maximum amount of items selected.
	 */
	showSelection?: boolean | number;

	/**
	 * Wether the current selection should be shown in the dialog list.
	 */
	showListSelection?: boolean;

	/**
	 * Wether to stop propagation of click events to parent elements.
	 */

	stopPropagation?: boolean;
	/**
	 * Disables the button so that it cannot be clicked anymore
	 */

	isDisabled?: boolean;
	/**
	 * Displays the button in the secondary style
	 */
	isSecondary?: boolean;
}) => {
	const handleClick = () => {
		const list: SelectDialogItem[] = [];
		props.list.map((item) => {
			list.push({
				name: item[props.listValue || "value"],
				value: item[props.listKey || "key"],
			} as SelectDialogItem);
		});

		dialog
			.select({
				list: list,
				multiselect: props.multiSelect,
				quickfind: props.quickFind,
				title: props.title,
				selectAllButton: props.selectAllButton,
				message: props.description,
			})
			.then((e: any) => {
				props.onSelect &&
					props.onSelect({
						[props.listKey || "key"]: e.selection[0].value,
						[props.listValue || "value"]: e.selection[0].name,
					});
			});
	};

	return (
		<Button
			isDisabled={props.isDisabled}
			isSecondary={props.isSecondary}
			onClick={handleClick}
		>
			{props.label}
		</Button>
	);
};
