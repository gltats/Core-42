/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   utils.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: ydimitro <ydimitro@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/10/02 11:43:31 by ydimitro          #+#    #+#             */
/*   Updated: 2023/10/02 19:53:23 by ydimitro         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "cub3d.h"

void	position_offset(t_main *main, t_wall *wall)
{
	if (main->p_dir == 'N')
		wall->p_offset = 0;
	else if (wall->main->p_dir == 'E')
		wall->p_offset = 90;
	else if (wall->main->p_dir == 'S')
		wall->p_offset = 180;
	else if (wall->main->p_dir == 'W')
		wall->p_offset = 270;
}

void	my_mlx_pixel_put(t_data *data, int x, int y, int color)
{
	char	*dst;

	if (x < S_WIDTH && y < S_HEIGHT && x > 0 && y > 0)
	{
		dst = data->addr + (y * data->line_length + x * \
												(data->bits_per_pixel / 8));
		*(unsigned int *)dst = color;
	}
}

void	load_assets(t_wall *height)
{
	if (height->main->north_t != NULL)
		load_texure(height->wall_tex->texture_north, \
			height, height->main->north_t);
	else
		load_texure(height->wall_tex->texture_north, height, D_NO);
	if (height->main->south_t != NULL)
		load_texure(height->wall_tex->texture_south, \
			height, height->main->south_t);
	else
		load_texure(height->wall_tex->texture_south, height, D_SO);
	if (height->main->east_t != NULL)
		load_texure(height->wall_tex->texture_east, \
			height, height->main->east_t);
	else
		load_texure(height->wall_tex->texture_east, height, D_EA);
	if (height->main->west_t != NULL)
		load_texure(height->wall_tex->texture_west, \
			height, height->main->west_t);
	else
		load_texure(height->wall_tex->texture_west, height, D_WE);
	if (height->main->floor == -1)
		height->main->floor = D_F;
	if (height->main->ceiling == -1)
		height->main->ceiling = D_C;
}
