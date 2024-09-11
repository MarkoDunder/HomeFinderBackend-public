import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../auth/models/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/role.enum';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Bookmarks') // Include this if your endpoints require authentication
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
  @ApiOperation({ summary: 'Add a bookmark' })
  @ApiResponse({
    status: 201,
    description: 'The bookmark has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/:listingId')
  async addBookmark(@Request() req, @Param('listingId') listingId: number) {
    return this.bookmarkService.bookmark(req.user, listingId);
  }
  //
  @ApiOperation({ summary: 'Remove a bookmark' })
  @ApiResponse({
    status: 200,
    description: 'The bookmark has been successfully removed.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete('/:listingId')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async removeBookmark(@Request() req, @Param('listingId') listingId: number) {
    return this.bookmarkService.removeBookmark(req.user, listingId);
  }

  @ApiOperation({ summary: 'Get All BookMark' })
  @ApiResponse({
    status: 200,
    description: 'The bookmark has been successfully removed.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('/findAllBookMarks')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  async getAllUsersBookMarks(@Request() req) {
    return this.bookmarkService.findAllBookMarksOfUsersOnItems(req.user);
  }
  //
  // @ApiOperation({ summary: 'Get user bookmarks' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'The user bookmarks have been successfully retrieved.',
  // })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // @Get()
  // async getUserBookmarks(@GetUser() user: UserEntity) {
  //   return this.bookmarkService.findUserBookmarks(user);
  // }
}
