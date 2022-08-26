import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import type { MessageSelectMenu, SelectMenuInteraction } from 'discord.js';

export class RoleMenuHandler extends InteractionHandler {
  public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.SelectMenu
    });
  }

  public override parse(interaction: SelectMenuInteraction) {
    if (interaction.customId !== 'auto_roles') return this.none();

    return this.some();
  }

  public async run(interaction: SelectMenuInteraction) {
    const component = interaction.component as MessageSelectMenu
    const removed = component.options.filter((option) => {
      return !interaction.values.includes(option.value)
    })

    const user = await interaction.guild?.members.fetch(interaction.user.id)

    for (const id of removed) {
      user!.roles.remove(id.value)
    }

    for (const id of interaction.values) {
      user!.roles.add(id)
    }

    await interaction.reply({
      // Remember how we can have multiple values? Let's get the first one!
      content: `Roles updated`,
      ephemeral: true
    });
  }
}