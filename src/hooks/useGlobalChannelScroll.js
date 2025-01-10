import { useRef, useEffect } from "react";

export default function useGlobalChannelScroll(messages) {
	const scrollRef = useRef(null);
	const scrollAreaRef = useRef(null);
	const isInitialMount = useRef(true);
	const shouldScrollRef = useRef(false);

	const isScrollAtBottom = (scrollContainer) => {
		if (!scrollContainer) {
			// console.log("scrollContainer is null");
			return false;
		}

		const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
		// console.log(
		// 	`scrollTop: ${scrollTop} clientHeight: ${clientHeight} scrollHeight: ${scrollHeight}`
		// );

		const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
		// console.log("isAtBottom:", isAtBottom);

		return isAtBottom;
	};

	const handleScrollCheckEffect = () => {
		if (!scrollAreaRef.current) {
			// console.log("scrollAreaRef.current is null");
			return;
		}

		const queryElement = "[data-radix-scroll-area-viewport]";
		const scrollContainer = scrollAreaRef.current.querySelector(queryElement);

		const isAtBottom = isScrollAtBottom(scrollContainer);

		shouldScrollRef.current = isAtBottom;
	};

	const handleScrollEffect = () => {
		if (scrollRef.current) {
			// console.log("Scrolling");
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const initialMountEffect = () => {
		if (isInitialMount.current) {
			// console.log("Initial Mount, skipping scroll");
			isInitialMount.current = false;
			return;
		}
		handleScrollCheckEffect();
	};

	const scrollEffect = () => {
		if (!shouldScrollRef.current) return;
		handleScrollEffect();
	};

	useEffect(initialMountEffect, [messages]);
	useEffect(scrollEffect, [messages, shouldScrollRef.current]);

	return { scrollRef, scrollAreaRef };
}
