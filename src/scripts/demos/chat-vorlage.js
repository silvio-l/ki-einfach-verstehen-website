// Logic of the ChatVorlageDemo (Baustein vom-textfortsetzer-zum-assistenten,
// section "Der Chat ist Text mit Marken"). It rebuilds the chat template of
// Qwen3-0.6B for the cases the demo shows: an optional system message, one
// user message, and the open assistant head. The template is the published
// one (field chat_template of tokenizer_config.json, retrieved 2026-10-12, kept
// in data/qwen3-0.6b-chat-template.json); the tests check the strings against
// it. No model runs here and no tokenizer is used: the output is text.
// Tests: chat-vorlage.test.mjs.

export const DEFAULT_SYSTEM = '';
export const DEFAULT_USER = 'Wie heißt die Hauptstadt von Frankreich?';

/**
 * The sequence as parts. `marker` is a special token, `role` the role name,
 * `content` the text the reader typed, `newline` a line break the template writes.
 * An empty system message is left out (the field is optional; the template
 * itself adds no default system text for Qwen3).
 */
export function chatParts({ system = DEFAULT_SYSTEM, user = DEFAULT_USER, generationPrompt = true } = {}) {
	const parts = [];
	const message = (role, content) =>
		parts.push(
			{ kind: 'marker', text: '<|im_start|>' },
			{ kind: 'role', text: role },
			{ kind: 'newline', text: '\n' },
			{ kind: 'content', text: content },
			{ kind: 'marker', text: '<|im_end|>' },
			{ kind: 'newline', text: '\n' },
		);
	if (system !== '') message('system', system);
	message('user', user);
	if (generationPrompt) {
		parts.push({ kind: 'marker', text: '<|im_start|>' }, { kind: 'role', text: 'assistant' }, { kind: 'newline', text: '\n' });
	}
	return parts;
}

/** The sequence as one string, exactly as the template produces it. */
export function renderChat(options) {
	return chatParts(options)
		.map((part) => part.text)
		.join('');
}

/** Length in code points, like Python's len() on the same string. */
export function countChars(text) {
	return [...text].length;
}
