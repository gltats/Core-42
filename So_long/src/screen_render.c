/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   screen_render.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/27 17:00:54 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 22:16:03 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

// Display the number of moves on the game window.
void	ft_score(t_data *data)
{
	data->move_count_screen = ft_itoa(data->move_count);
	mlx_string_put(data->mlx, data->window, 30, 30, 0xff00ff, \
	"Moves: ");
	mlx_string_put(data->mlx, data->window, 65, 30, 0xff00ff, \
		data->move_count_screen);
	free(data->move_count_screen);
}

// Display the player's image based on their current position.
void	ft_put_image_player(t_data *data, int x, int y)
{
	if (data->curr_pos == 'U')
		mlx_put_image_to_window(data->mlx, data->window, data->p_up, x, y);
	else if (data->curr_pos == 'R')
		mlx_put_image_to_window(data->mlx, data->window, data->p_right, x, y);
	else if (data->curr_pos == 'L')
		mlx_put_image_to_window(data->mlx, data->window, data->p_left, x, y);
	else if (data->curr_pos == 'D')
		mlx_put_image_to_window(data->mlx, data->window, data->p_down, x, y);
}

//x=columns, y=rows
//l50 Display the appropriate image based on the current
// element in the map_2d array.
//l63 Check if the player is on the exit tile
void	ft_put_image(t_data *data)
{
	int	x;
	int	y;

	y = 0;
	while (y < data->map_y)
	{
		x = 0;
		while (x < data->map_x)
		{
			if (data->map_2d[y][x] == '1')
				ft_put_image_wall(data, x, y);
			else if (data->map_2d[y][x] == '0')
				ft_put_image_backg(data, x, y);
			else if (data->map_2d[y][x] == 'C')
				ft_put_image_colect(data, x, y);
			else if (data->map_2d[y][x] == 'E')
				ft_put_image_exit(data, x, y);
			ft_put_image_player_cond(data, x, y);
			x++;
		}
		y++;
	}
	ft_score(data);
}

void	ft_in_image(t_data *data)
{
	data->p_up = mlx_xpm_file_to_image(data->mlx, P_UP,
			&data->img_x, &data->img_y);
	data->p_down = mlx_xpm_file_to_image(data->mlx, P_DOWN,
			&data->img_x, &data->img_y);
	data->p_left = mlx_xpm_file_to_image(data->mlx, P_LEFT,
			&data->img_x, &data->img_y);
	data->p_right = mlx_xpm_file_to_image(data->mlx, P_RIGHT,
			&data->img_x, &data->img_y);
	data->backg = mlx_xpm_file_to_image(data->mlx, BACKG,
			&data->img_x, &data->img_y);
	data->colect = mlx_xpm_file_to_image(data->mlx, COLLECTIBLE,
			&data->img_x, &data->img_y);
	data->exit = mlx_xpm_file_to_image(data->mlx, EXIT,
			&data->img_x, &data->img_y);
	data->wall = mlx_xpm_file_to_image(data->mlx, WALL,
			&data->img_x, &data->img_y);
	data->window = mlx_new_window(data->mlx,
			data->map_x * 32, data->map_y * 32, "so_long");
	data->curr_pos = 'U';
	ft_put_image(data);
}
