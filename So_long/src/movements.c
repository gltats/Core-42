/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movements.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/15 18:04:59 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 21:59:10 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	ft_check_mov(t_data *data)
{
	if (data->tmp_collectible == 0 && data->ply_y == data->ex_y
		&& data->ply_x == data->ex_x)
	{
		ft_putstr("Congratulations!\n");
		ft_free_mlx(data);
		ft_free_all(data);
		exit(EXIT_SUCCESS);
	}
	return (0);
}

void	ft_render_after_move(t_data *data)
{
	mlx_clear_window(data->mlx, data->window);
	ft_put_image(data);
}
