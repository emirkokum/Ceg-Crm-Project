using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Note;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System;

namespace CegCRMAPI.Application.Features.Queries.Note.GetAllNotes
{
    public class GetAllNotesQuery : IRequest<ApiResponse<List<NoteDto>>>
    {
    }

    public class GetAllNotesQueryHandler : IRequestHandler<GetAllNotesQuery, ApiResponse<List<NoteDto>>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IMapper _mapper;

        public GetAllNotesQueryHandler(INoteRepository noteRepository, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<NoteDto>>> Handle(GetAllNotesQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var notes = await _noteRepository.GetAllAsync(cancellationToken);
                var noteDtos = _mapper.Map<List<NoteDto>>(notes);
                return ApiResponse<List<NoteDto>>.CreateSuccess(noteDtos, "Notes retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<NoteDto>>.CreateError($"Failed to retrieve notes: {ex.Message}");
            }
        }
    }
} 