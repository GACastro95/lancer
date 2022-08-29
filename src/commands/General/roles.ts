import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { MessageActionRow, MessageSelectMenu, MessageSelectOptionData, TextChannel } from 'discord.js';

@ApplyOptions<Command.Options>({
	aliases: ['r'],
	description: 'creates a menu for users to add roles',
	generateDashLessAliases: true,
	requiredUserPermissions: 'MANAGE_ROLES'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addChannelOption((option) =>
					option //
						.setName('channel')
						.setDescription('Channel to get')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option //
						.setName('message')
						.setDescription('Message to target')
						.setRequired(true)
				)
				.addRoleOption((option) =>
					option //
						.setName('role')
						.setDescription('Role to add')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option //
						.setName('emoji')
						.setDescription('Emoji associated to role')
						.setRequired(false)
				)
		);
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		const channel = interaction.options.getChannel('channel') as TextChannel;
		const messageId = interaction.options.getString('message');
		const role = interaction.options.getRole('role');
		const emoji = interaction.options.getString('emoji');
		const validEmoji = /a?:?(.+):(\d+)/.test(emoji!);

		if (!validEmoji && emoji! !== null) {
			return interaction.reply({ content: `Invalid emoji given` });
		}

		const targetMessage = await channel.messages.fetch(messageId!, {
			cache: true,
			force: true
		});

		if (!targetMessage) {
			return interaction.reply({ content: `Message not found` });
		}

		if (targetMessage.author.id !== interaction.client.user?.id) {
			return interaction.reply({ content: `Please provide a message that was sent from <@${interaction.client.user?.id}>` });
		}

		let row = targetMessage.components[0] as MessageActionRow;
		if (!row) {
			row = new MessageActionRow();
		}

		const option: MessageSelectOptionData[] = [
			{
				label: role!.name,
				value: role!.id,
				emoji: emoji!
			}
		];

		let menu = row.components[0] as MessageSelectMenu;
		if (menu) {
			for (const o of menu.options) {
				if (o.value === option[0].value) {
					return interaction.reply({ content: `Role ${role} already added to menu`, ephemeral: true, allowedMentions: { roles: [] } });
				}
			}
			menu.addOptions(option);
			menu.setMaxValues(menu.options.length);
		} else {
			row.addComponents(
				new MessageSelectMenu()
					.setCustomId('auto_roles')
					.setMinValues(0)
					.setMaxValues(1)
					.setPlaceholder('Select your roles...')
					.addOptions(option)
			);
		}

		targetMessage.edit({ components: [row] });

		return interaction.reply({ content: `Added ${role} to the menu`, allowedMentions: { roles: [] }, ephemeral: true });
	}
}
